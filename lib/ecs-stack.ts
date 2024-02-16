import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import {  Cluster, ContainerDefinition, CpuArchitecture, EcrImage, OperatingSystemFamily } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from "constructs";
import path = require("path");

interface CustomProps extends StackProps {
    vpc: IVpc
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
                image: EcrImage.fromDockerImageAsset(new DockerImageAsset(this, 'asset', {
                    directory: path.join(__dirname, '..', 'src')
                })),
                containerPort: 8094,
            },
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.X86_64,
                operatingSystemFamily: OperatingSystemFamily.LINUX
            }
        })
    }
}