# Elastic Container Services (Build you first ECS Cluster with )

AWS Fargate is a technology that you can use with Amazon ECS to run containers without having to manage servers or clusters of Amazon EC2 instances. With Fargate, you no longer have to provision, configure, or scale clusters of virtual machines to run containers. This removes the need to choose server types, decide when to scale your clusters, or optimize cluster packing.

![Screenshot](images/ecs_1.jpeg)


This project describes the different components reuired to build an ECS service

### Step 1: (Build the stack-infra in both regions)

```
mkdir my-first-ecs-project
cd  my-first-ecs-project
```

**- CREATE A NODE PROJECT WITH THE DEFAULTS**

`npm init -y`

**- CRETAE AN EXPRESS SERVER**

```
npm install express -save
npm install
```

**- CREATE A server.js FILE AND ADD THE FOLLOWING**

```
const express = require('express');
const app = express();
app.use(express.json());

app.listen(8080, () => {
  console.log('Server is up on 8080');
});
```

**- START THE SERVER**

`node server.js`

You may do the following to release the port if the port 8080 is already in use

```
sudo lsof -i :8080
sudo kill -9 PID
```

**- TRY LOCALHOST**

http://localhost:8080/

**- NOW ADD A GET AND A HEALTHCHECK END POINT IN THE server.js**

```
app.get('/', async (req, res, next) => {
  try {
    let returnjson = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        text: 'Hello World!',
      }),

      isBase64Encoded: false,
    };
    res.json(returnjson);
  } catch (error) {
    return next(error);
  }
});
```

```
app.get('/healthcheck', async (req, res, next) => {
  try {
    let returnjson = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'success',
        text: '_AOKA_',
      }),
      isBase64Encoded: false,
    };
    res.json(returnjson);
  } catch (error) {
    return next(error);
  }
});
```

**- ACCESS THE above end points **

http://localhost:8080/

http://localhost:8080/heathcheck/

---

      CREATE A DOCKER IMAGE

---

**- CREATE A FILE CALLED Dockerfile and add the following (find the your version by node --version)**

```
FROM node:12.22.3
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
#Copy everything in the current folder, to the WORKDIR
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
```

**- NOW BUILD THE CONTAINER**

`docker build -t my-first-ecs-project .`

**- NOW RUN THE IMAGE and access the end points via localhost**

`docker run -p 8080:8080 -d my-first-ecs-project`

http://localhost:8080/

http://localhost:8080/healthcheck/

---

      Create AWS ECR And Push the Docker Image

---

**- CREATE ECR**

Please make sure to edit the

1. OrgUnit

Then execute the following from the AWS CLI (please make sure to replace {jj7525} with your employee id or someother unique identifier)

`aws cloudformation create-stack --stack-name jj7525-hello-world-ecr-repo --template-body file://ecr.yml --profile saml --capabilities CAPABILITY_AUTO_EXPAND`

**- TAG THE IMAGE**

`docker image tag my-first-ecs-project:latest 417592845839.dkr.ecr.us-east-1.amazonaws.com/jj7525-ecr-dev-hworld-repo:latest`

**- GET THE ECR CREDENTIALS**

`aws ecr get-login-password --profile saml | docker login --username AWS --password-stdin 417592845839.dkr.ecr.us-east-1.amazonaws.com`

This command retrieves and displays an authentication token using the GetAuthorizationToken API that you can use to authenticate to an Amazon ECR registry

**- PUSH THE IMAGE TO ECR**

`docker push 417592845839.dkr.ecr.us-east-1.amazonaws.com/jj7525-ecr-dev-hworld-repo:latest`

---

      Create ELB, ECS Service/Task

---

**- CREATE LOAD BALANCER, LISTENER, CONTAINER SECURITY GROUP, LOAD BALANCER SECURITY GROUP ETC**

Please make sure to edit the

1. OrgUnit
2. SSL Cert

Before creating the below stack

Then execute the following from the AWS CLI (please make sure to replace {jj7525} with your employee id or someother unique identifier)

`aws cloudformation create-stack --stack-name jj7525-hello-world-elb-repo --template-body file://elb.yml --profile saml --capabilities CAPABILITY_AUTO_EXPAND`

**- CREATE ECS CLUSTER, ECS SERVICE TASKS ETC**

Please Make sure to update the

1. Image ID
2. Container Security Group ID
3. Load Balancer Security Group ID
4. Target Group

Before creating the below stack

Then execute the following from the AWS CLI (please make sure to replace {jj7525} with your employee id or someother unique identifier)

`aws cloudformation create-stack --stack-name jj7525-hello-world-ecs-repo --template-body file://ecs.yml --profile saml --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_IAM`

---

      WE ARE DONE!!!

---

The end point is now accessible via

https://{hostname of the ELB}/healthcheck

---

- CREATE THE CUSTOM DOMAIN/SSL CERT [THIS IS OPTIONAL]

---

**- CREATE A CERTIFCATE**

Please make sure to edit the

1. HostedZoneDomain

Then execute the following from the AWS CLI (please make sure to replace {jj7525} with your employee id or someother unique identifier)

`aws cloudformation create-stack --stack-name jj7525-hello-world-cert-repo --template-body file://cert.yml --profile saml --capabilities CAPABILITY_AUTO_EXPAND`

**- Update the Load Balancer to use the newwly created custom hostmane and SSL Cert**
Please Make sure to update the

1. SSL Certificate ARN
2. Uncomment HWDomain
3. Uncomment the Conditions
4. Change the LoadBalancerPort Port from 80 to 443
5. Change the LoadBalancerListener Protocol from HTTP to HTTPS
6. Uncomment the DNSRecord block

Then execute the following from the AWS CLI (please make sure to replace {jj7525} with your employee id or someother unique identifier)

`aws cloudformation update-stack --stack-name jj7525-hello-world-elb-repo --template-body file://elb.yml --profile saml --capabilities CAPABILITY_AUTO_EXPAND`

The end point are is now accessible via

https://jj7525-s.bindg.com
https://jj7525-s.bindg.com/healthcheck
