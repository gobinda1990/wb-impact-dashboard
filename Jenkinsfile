pipeline {
    agent any

    environment {
        // SonarQube configuration
        SONARQUBE_SERVER = 'sonar'
        SONAR_HOST_URL = 'http://10.153.43.8:9000'
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_PROJECT_KEY = 'wb-impact-dashboard'
        SONAR_PROJECT_NAME = 'wb-impact-dashboard'

        // Docker image info
        IMAGE_NAME = 'wb-impact-dashboard'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo ' Checking out code...'
                git branch: 'main', url: 'https://github.com/gobinda1990/wb-impact-dashboard.git'
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

        stage('Pre-Build React Check') {
            steps {
                echo '🧪 Checking React build before Docker...'
                sh '''
                    npm ci
                    npm run build || (echo " React build failed!" && exit 1)
                    if [ ! -d build ]; then
                      echo " ERROR: build directory not found!"
                      exit 1
                    fi
                    ls -la build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo ' Building Docker image for React app...'
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Locally') {
            steps {
                echo ' Deploying container locally...'
                sh """
                    docker ps -q --filter "name=${IMAGE_NAME}" | grep -q . && docker stop ${IMAGE_NAME} || true
                    docker rm -f ${IMAGE_NAME} || true
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
            echo ' Pipeline failed!'
        }
    }
}
