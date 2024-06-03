pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
               git branch: 'main', url: 'https://github.com/FRIASMIGUEL/exercicio-14--api-usuarios.git'
               bat 'npm install'
        }
        }
        
       stage('Test') {
            steps { bat '''set NO_COLOR=1  
                    npm test '''   
    
    }
    }
    }
    }
















