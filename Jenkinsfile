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
                echo '🔹 Checking out wb-impact-dashboard repository...'
                git branch: 'main', url: 'https://github.com/gobinda1990/wb-impact-dashboard.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building wb-impact-dashboard Docker image...'
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Run Container Locally') {
            steps {
                echo '🚀 Running wb-impact-dashboard locally...'
                sh """
                    docker rm -f ${IMAGE_NAME} || true
                    docker run -d --name ${IMAGE_NAME} -p 8080:80 ${IMAGE_NAME}:latest
                """
                echo '✅ Application deployed locally at http://localhost:8080'
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
            echo '❌ Pipeline failed! Check logs above.'
        }
    }
}
