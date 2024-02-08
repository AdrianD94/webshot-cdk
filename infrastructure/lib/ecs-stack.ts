import { Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { Cluster, CpuArchitecture, EcrImage, OperatingSystemFamily } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface CustomProps extends StackProps {
    vpc: IVpc;
    repository: IRepository;
}
export class EcsStack extends Stack {

    constructor(scope: Construct, id: string, props: CustomProps) {
        super(scope, id, props);
        const cluster = new Cluster(this, 'webshot-ecs', {
            clusterName: 'webshot-ecs',
            vpc: props.vpc,
            containerInsights: true
        });

        new ApplicationLoadBalancedFargateService(this, 'webshot-fargate', {
            assignPublicIp: true,
            cluster,
            cpu:256,
            desiredCount: 3,
            domainName: 'domain name',
            domainZone: HostedZone.fromHostedZoneAttributes(this, 'webshot-hosted',{
                zoneName: 'domain name',
                hostedZoneId: 'hosted zone id from route 53'
            }),
            publicLoadBalancer: true,
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.ARM64,
                operatingSystemFamily: OperatingSystemFamily.LINUX
            },
            taskImageOptions: {
                image: EcrImage.fromEcrRepository(props.repository),
                containerPort: 8094
            },
            serviceName: 'webshot-fargate',
            protocol: ApplicationProtocol.HTTPS,
            redirectHTTP: true,
            certificate: Certificate.fromCertificateArn(this, 'certificate', 'certificate arn from certificate manager')
        })
    }
}