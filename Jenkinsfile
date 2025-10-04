pipeline {
    agent none

    stages {
        // TAHAP UTAMA UNTUK BUILD
        stage('Build Image on Remote Agent') {
            agent { label 'tencent-vm' }
            
            // Definisikan variabel di sini agar bisa diakses oleh sub-stage
            environment {
                IMAGE_NAME = ''
            }

            // TAHAPAN KECIL DI DALAM BUILD
            stages {
                stage('Login to Docker') {
                    steps {
                        withCredentials([
                            usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                        ]) {
                            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        }
                    }
                }
                stage('Build Image') {
                    steps {
                        // Tarik semua kredensial yang dibutuhkan untuk build
                        withCredentials([
                            string(credentialsId: 'dockerhub-username', variable: 'DOCKER_REGISTRY_USER'),
                            string(credentialsId: 'vite-grpc-server-url', variable: 'VITE_GRPC_URL'),
                            string(credentialsId: 'vite-rest-upload-url', variable: 'VITE_REST_URL')
                        ]) {
                            script {
                                IMAGE_NAME = "${DOCKER_REGISTRY_USER}/react-frontend:latest"
                                // Build dengan --build-arg
                                sh """
                                    docker build \\
                                        --build-arg VITE_GRPC_SERVER_URL=${VITE_GRPC_URL} \\
                                        --build-arg VITE_REST_UPLOAD_URL=${VITE_REST_URL} \\
                                        -t ${IMAGE_NAME} .
                                """
                            }
                        }
                    }
                }
                stage('Push') {
                    steps {
                        sh "docker push ${IMAGE_NAME}"
                    }
                }
            }
            
            // Aksi yang selalu dijalankan setelah semua sub-stage di atas selesai
            post {
                always {
                    sh 'docker logout'
                }
            }
        }

        // TAHAP UTAMA UNTUK DEPLOY
        stage('Deploy Service on Local Server') {
            agent { label 'built-in' }
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'deploy-server-credentials', usernameVariable: 'SSH_USER', passwordVariable: 'SSH_PASS'),
                    string(credentialsId: 'deploy-server-ip', variable: 'DEPLOY_SERVER_IP')
                ]) {
                    sh "sshpass -p '${SSH_PASS}' ssh -o StrictHostKeyChecking=no ${SSH_USER}@${DEPLOY_SERVER_IP} 'cd /home/root/grpc-ecom && docker-compose pull frontend && docker-compose up -d --no-deps frontend && docker system prune -af'"
                }
            }
        }
    }
}