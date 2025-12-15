pipeline {
    agent any

    environment {
        // 🐳 Docker image info
        IMAGE_NAME = 'wb-impact-dashboard'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo ' Checking out wb-impact-dashboard repository...'
                git branch: 'main', url: 'https://github.com/gobinda1990/wb-impact-dashboard.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo ' Building Docker image for Vite app...'
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Locally') {
            steps {
                echo ' Deploying wb-impact-dashboard locally...'
                sh """
                    # Stop and remove old container if it exists
                    docker ps -q --filter "name=${IMAGE_NAME}" | grep -q . && docker stop ${IMAGE_NAME} || true
                    docker rm -f ${IMAGE_NAME} || true

                    # Run new container
                    docker run -d --name ${IMAGE_NAME} -p 8084:80 ${IMAGE_NAME}:latest
                """
                echo ' Application deployed locally at http://localhost:8084'
            }
        }
    }

    post {
        always {
            echo ' Cleaning workspace...'
            cleanWs()
        }
        success {
            echo ' Pipeline completed successfully!'
        }
        failure {
            echo ' Pipeline failed!'
        }
    }
}