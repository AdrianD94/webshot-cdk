import{ CfnOutput, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EcrStack } from './ecr-stack';
import { EcsStack } from './ecs-stack';
import { VpcStack } from './vpc-stack';

export interface baseStageProps extends StageProps {
    customGreeting: string,
    bg: string
}

export class BaseStage extends Stage {
    public readonly albAddress: CfnOutput
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const ecr = new EcrStack(this, EcrStack.name, {});
        const vpc = new VpcStack(this, VpcStack.name, {});
        new EcsStack(this, EcsStack.name, { repository: ecr.repository, vpc: vpc.vpc })
        
    }
}