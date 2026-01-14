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

        // Expose container ports to host
        HOST_HTTP_PORT = '8084'       // Host port for HTTP (redirects to HTTPS)
        HOST_HTTPS_PORT = '8443'      // Host port for HTTPS access
        CONTAINER_HTTP_PORT = '80'    // Container port for HTTP
        CONTAINER_HTTPS_PORT = '443'  // Container port for HTTPS
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
                        sh '''
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
                        '''
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
        stage('Deploy Locally (HTTP:8084, HTTPS:8443)') {
            steps {
                echo "Deploying ${IMAGE_NAME} locally on ports 8084 (HTTP) and 8443 (HTTPS)..."
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm ${IMAGE_NAME} || true

                    docker run -d \
                      --name ${IMAGE_NAME} \
                      -p ${HOST_HTTP_PORT}:${CONTAINER_HTTP_PORT} \
                      -p ${HOST_HTTPS_PORT}:${CONTAINER_HTTPS_PORT} \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:latest
                """
            }
        }
    }

    // ---------- Post Actions ----------
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
