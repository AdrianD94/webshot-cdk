import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { BaseStage } from './base-stage-stack';
import { Params } from './params';

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            crossAccountKeys: true,
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub(Params.GITHUB_REPO, Params.BRANCH_NAME, {
                    authentication: SecretValue.secretsManager(Params.GITHUB_TOKEN)
                }),
                commands: ['npm i -g npm@latest','npm i', 'npm run build', 'npx cdk synth']
            })
        });

        const devStage = new BaseStage(this, 'DevStage', {
            env: {
                account: Params.DEV_ACCOUNT_ID,
                region: Params.AWS_REGION
            },
        });
        pipeline.addStage(devStage);
    }
}