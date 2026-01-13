pipeline {
    agent any

    environment {
        // ===== SonarQube Configuration =====
        SONARQUBE_SERVER   = 'sonar'
        SONAR_HOST_URL     = 'http://10.153.43.8:9000'
        SONAR_PROJECT_KEY  = 'wb-impact-dashboard'
        SONAR_PROJECT_NAME = 'wb-impact-dashboard'
        SCANNER_HOME       = tool 'sonar-scanner'

        // ===== Docker Build Variables =====
        IMAGE_NAME = 'wb-impact-dashboard'
        IMAGE_TAG  = "${BUILD_NUMBER}"
        HOST_PORT = '80'               // Host port
        CONTAINER_HTTPS_PORT = '443'   // Container HTTPS port
    }

    stages {

        // ---------- Source Checkout ----------
        stage('Checkout') {
            steps {
                echo 'Checking out wb-impact-dashboard repository...'
                git branch: 'main',
                    url: 'https://github.com/gobinda1990/wb-impact-dashboard.git'
            }
        }

        // ---------- Code Quality ----------
        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube analysis for Vite/React app..."
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh """
                            echo "Using SCANNER_HOME=$SCANNER_HOME"
                            ${SCANNER_HOME}/bin/sonar-scanner \
                              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                              -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=node_modules/**,dist/**,build/** \
                              -Dsonar.language=js \
                              -Dsonar.sourceEncoding=UTF-8 \
                              -Dsonar.host.url=${SONAR_HOST_URL} \
                              -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        // ---------- Docker Build ----------
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        // ---------- Deploy ----------
        stage('Deploy Docker Container') {
            steps {
                echo "Deploying ${IMAGE_NAME} locally on host port ${HOST_PORT}..."
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm ${IMAGE_NAME} || true

                    docker run -d \
                      --name ${IMAGE_NAME} \
                      -p ${HOST_PORT}:${CONTAINER_HTTPS_PORT} \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
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
