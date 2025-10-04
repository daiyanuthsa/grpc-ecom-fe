pipeline {
    agent none

    stages {
        // TAHAP INI DIJALANKAN DI VM GCP
        stage('Build Image on Remote Agent') {
            agent { label 'tencent-vm' }
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    string(credentialsId: 'dockerhub-username', variable: 'DOCKER_REGISTRY_USER')
                ]) {
                    script {
                        def imageName = "${DOCKER_REGISTRY_USER}/react-frontend:latest"
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker build -t ${imageName} ."
                        sh "docker push ${imageName}"
                        sh "docker logout"
                    }
                }
            }
        }

        // TAHAP INI DIJALANKAN DI JENKINS MASTER (STB ANDA)
        stage('Deploy Service on Local Server') {
            agent { label 'master' }
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'deploy-server-credentials', usernameVariable: 'SSH_USER', passwordVariable: 'SSH_PASS'),
                    string(credentialsId: 'deploy-server-ip', variable: 'DEPLOY_SERVER_IP')
                ]) {
                    sh "sshpass -p '${SSH_PASS}' ssh -o StrictHostKeyChecking=no ${SSH_USER}@${DEPLOY_SERVER_IP} 'cd /home/root/my-app && docker-compose pull frontend && docker-compose up -d --no-deps frontend && docker system prune -af'"
                }
            }
        }
    }
}