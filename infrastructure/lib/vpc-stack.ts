import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc, IpAddresses, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VpcStack extends Stack {
    public readonly vpc: IVpc;
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        this.vpc = new Vpc(this, 'webshot-vpc', {
            maxAzs: 2,
            vpcName: 'webshot-vpc',
            ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
            subnetConfiguration: [
                {
                    name: 'public-1',
                    cidrMask: 24,
                    subnetType: SubnetType.PUBLIC
                },
                {
                    name: 'private-1',
                    cidrMask: 24,
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS
                }
            ]
        })
    }
}


export class VpcStack2 extends Stack {
    public readonly vpc: IVpc;
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        this.vpc = new Vpc(this, 'webshot-vpc', {
            vpcName: 'webshot-vpc',
            maxAzs: 2,
            ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
            subnetConfiguration: [
                {
                    name: 'public-1',
                    cidrMask: 24,
                    subnetType: SubnetType.PUBLIC
                },
                {
                    name: 'private-1',
                    cidrMask: 24,
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS
                }
            ]
        })
    }
}