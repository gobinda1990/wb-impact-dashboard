pipeline {
    agent any

    environment {
        // 🧠 SonarQube configuration
        SONARQUBE_SERVER = 'sonar'                   // Name from Jenkins global config
        SONAR_HOST_URL = 'http://10.153.43.8:9000'   // SonarQube server URL
        SCANNER_HOME = tool 'sonar-scanner'          // SonarQube scanner tool name
        SONAR_PROJECT_KEY = 'wb-impact-dashboard'
        SONAR_PROJECT_NAME = 'wb-impact-dashboard'

        // Docker image info
        IMAGE_NAME = 'wb-impact-dashboard'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo ' Checking out source code...'
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube analysis...'
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.sources=src \
                          -Dsonar.language=js \
                          -Dsonar.sourceEncoding=UTF-8 \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for React app...'
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Locally') {
            steps {
                echo ' Deploying container locally...'

                // Stop and remove old container if it exists
                sh """
                    docker ps -q --filter "name=${IMAGE_NAME}" | grep -q . && docker stop ${IMAGE_NAME} || true
                    docker rm -f ${IMAGE_NAME} || true
                """

                // Run new container
                sh """
                    docker run -d --name ${IMAGE_NAME} -p 8080:80 ${IMAGE_NAME}:latest
                """

                echo 'App deployed locally at http://localhost:8080'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
        success {
            echo ' Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
