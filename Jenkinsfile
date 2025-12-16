pipeline {
    agent any

    tools {
        sonarScanner 'sonar-scanner'
    }

    environment {
        SONARQUBE_SERVER = 'sonar'
        SONAR_HOST_URL   = 'http://10.153.43.8:9000'
        SONAR_PROJECT_KEY = 'wb-impact-dashboard'
        SONAR_PROJECT_NAME = 'wb-impact-dashboard'

        IMAGE_NAME = 'wb-impact-dashboard'
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out wb-impact-dashboard repository...'
                git branch: 'main',
                    url: 'https://github.com/gobinda1990/wb-impact-dashboard.git'
            }
        }

        stage('SonarQube Scan - Frontend') {
            environment {
                SONAR_AUTH_TOKEN = credentials('sonar-token')
            }
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {                   
                        sh """
                        sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                          -Dsonar.sources=src \
                          -Dsonar.exclusions=node_modules/**,dist/** \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_AUTH_TOKEN}
                        """                 
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for Vite app...'
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Locally') {
            steps {
                echo 'Deploying wb-impact-dashboard locally...'
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm ${IMAGE_NAME} || true

                    docker run -d \
                      --name ${IMAGE_NAME} \
                      -p 8084:80 \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
