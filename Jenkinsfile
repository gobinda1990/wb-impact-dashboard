pipeline {
    agent any

    environment {
        SONARQUBE_SERVER   = 'sonar'
        SONAR_HOST_URL     = 'http://10.153.43.8:9000'
        SONAR_PROJECT_KEY  = 'wb-impact-dashboard'
        SONAR_PROJECT_NAME = 'wb-impact-dashboard'
        SCANNER_HOME       = tool 'sonar-scanner'

        IMAGE_NAME = 'wb-impact-dashboard'
        IMAGE_TAG  = "${BUILD_NUMBER}"
        HOST_PORT = '8084'           // Frontend exposed port
        CONTAINER_HTTPS_PORT = '443' // Internal container port
        DOCKER_NETWORK = 'my-network'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/gobinda1990/wb-impact-dashboard.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh """
                            ${SCANNER_HOME}/bin/sonar-scanner
                              -Dsonar.projectKey=${SONAR_PROJECT_KEY}
                              -Dsonar.projectName="${SONAR_PROJECT_NAME}"
                              -Dsonar.sources=src
                              -Dsonar.exclusions=node_modules/**,dist/**,build/**
                              -Dsonar.language=js
                              -Dsonar.sourceEncoding=UTF-8
                              -Dsonar.host.url=${SONAR_HOST_URL}
                              -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker network create ${DOCKER_NETWORK} || true

                    docker stop ${IMAGE_NAME} || true
                    docker rm ${IMAGE_NAME} || true

                    docker run -d
                      --name ${IMAGE_NAME}
                      -p ${HOST_PORT}:${CONTAINER_HTTPS_PORT}
                      --restart unless-stopped
                      ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
