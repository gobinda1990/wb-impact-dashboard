pipeline {
    agent any

    environment {
        // Docker image settings
        IMAGE_NAME = 'react-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"

        // SonarQube settings
        SONARQUBE_ENV = 'SonarQubeServer'   // Jenkins SonarQube server name (Manage Jenkins > Configure System)
        SONAR_PROJECT_KEY = 'react-frontend'
        SONAR_PROJECT_NAME = 'React Frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔹 Checking out source code...'
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube analysis...'
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    // Using the SonarQube Scanner (must be installed in Jenkins)
                    sh """
                        npx sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
                          -Dsonar.sources=src \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                          -Dsonar.sourceEncoding=UTF-8
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for React app...'
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Locally') {
            steps {
                echo '🚀 Deploying container locally...'

                // Stop old container (if running)
                sh """
                    docker ps -q --filter "name=${IMAGE_NAME}" | grep -q . && docker stop ${IMAGE_NAME} || true
                    docker rm -f ${IMAGE_NAME} || true
                """

                // Run new container
                sh """
                    docker run -d --name ${IMAGE_NAME} -p 8080:80 ${IMAGE_NAME}:latest
                """

                echo '✅ App deployed locally at http://localhost:8080'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
