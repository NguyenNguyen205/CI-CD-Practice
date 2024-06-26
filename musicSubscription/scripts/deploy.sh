#!/usr/bin/env bash

## Declare variable
stack_name="musicSubscriptionDeploy"
bucket_name="static-hosted-music-subscription"

## Output current root directory
working_dir=$(echo $PWD)
echo "Current root directroy: $working_dir"

## Run cloudformation stack in ap-southeast region
echo 'Start stack'
aws cloudformation create-stack --stack-name "$stack_name" --template-body file://musicSubscription//infrastructure//stack.yaml --region ap-southeast-2 --capabilities CAPABILITY_NAMED_IAM
echo 'Stack loaded'

## Await for infrastructure to finish
echo 'Stack creating'
aws cloudformation wait stack-create-complete --stack-name "$stack_name" --region ap-southeast-2
echo 'Stack created'

## Migrate data to the cloud
echo 'Migrate data'
python ./musicSubscription/migration/migration.py
echo 'Data migrate successfully'


## Get stack outputs
echo "Retrieving outputs from stack $stack_name"
api_gateway_endpoint=$(aws cloudformation describe-stacks --stack-name "$stack_name" --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='DynamoDBAPIInvokeURL'].OutputValue" --output text)
website_url=$(aws cloudformation describe-stacks --stack-name "$stack_name" --region ap-southeast-2 --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text)
echo "Get stack output successfully"

## Write outputs result into config.json
echo 'Write to config.json'
config_js="./musicSubscription/frontend/src/config.json"
cp $config_js.orig $config_js
SED_CMD="sed -i"
$SED_CMD "s|ENDPOINT_API|$api_gateway_endpoint|g" $config_js
$SED_CMD "s|FRONTEND_URL|$website_url|g" $config_js
echo "Write to config.json successfully"

## Upload frontend src to the s3 bucket
echo "Installing Node.js packages..."
cd ./musicSubscription/frontend/ && npm ci

echo "Building distribution for deployment..."
npm run-script build

echo "Copying build to S3..."
aws s3 cp ./build s3://$bucket_name --recursive

cd $working_dir # Go back to the root working directory


## Final results
echo "Visit your website here: $website_url"

## Utility command
# Update stack
# aws cloudformation update-stack --stack-name musicSubscriptionDeploy --template-body file://musicSubscription//infrastructure//stack.yaml --region ap-southeast-2 --capabilities CAPABILITY_NAMED_IAM
# Delete stack
# aws cloudformation delete-stack --stack-name musicSubscriptionDeploy --region ap-southeast-2