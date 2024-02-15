import { Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { AppProtocol, Cluster, ContainerDefinition, CpuArchitecture, EcrImage, OperatingSystemFamily } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface CustomProps extends StackProps {
    vpc: IVpc;
    repository: IRepository
}

export class EcsStack extends Stack {
    public readonly fargate: ApplicationLoadBalancedFargateService;
    public readonly container: ContainerDefinition;
    constructor(scope: Construct, id: string, props: CustomProps) {
        super(scope, id, props);

        const cluster = new Cluster(this, 'webshot-ecs', {
            clusterName: 'webshot-cluster',
            containerInsights: true,
            vpc: props.vpc,
        });
      
        this.fargate = new ApplicationLoadBalancedFargateService(this, 'webshot-fargate', {
            assignPublicIp: true,
            cluster,
            desiredCount: 1,
            publicLoadBalancer: true,
            taskImageOptions: {
                image: EcrImage.fromEcrRepository(props.repository),
                containerPort: 8094,
            },
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.ARM64,
                operatingSystemFamily: OperatingSystemFamily.LINUX
            }
        })
    }
}


export class EcsStack2 extends Stack {
    constructor(scope: Construct, id: string, props: CustomProps) {
        super(scope, id, props);
        const cluster = new Cluster(this, 'webshot-ecs-cluster', {
            clusterName: 'webshot-ecs',
            containerInsights: true,
            vpc: props.vpc
        });

        new ApplicationLoadBalancedFargateService(this, 'webshot-fargate-service', {
            assignPublicIp: true,
            certificate: Certificate.fromCertificateArn(this, 'certificate', ''),
            cluster,
            cpu: 512,
            desiredCount: 3,
            domainName: 'adriandrozman.com',
            domainZone: HostedZone.fromHostedZoneAttributes(this, 'hoste-zone', {
                hostedZoneId: '',
                zoneName: 'adriandrozman.com'
            }),
            protocol: ApplicationProtocol.HTTPS,
            publicLoadBalancer: true,
            redirectHTTP: true,
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.ARM64,
                operatingSystemFamily: OperatingSystemFamily.LINUX
            },
            serviceName: 'webshot-fargate-service',
            taskImageOptions: {
                image: EcrImage.fromEcrRepository(props.repository),
                containerPort: 8094
            }
        })
    }
}