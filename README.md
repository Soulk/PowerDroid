# Power Droid

Interface web utilsée pour la gestion de fichiers, le lancement des scripts d'analyse de données énergétiques et la présentation des résultats de ceux-ci.

## Résumé

Ce projet à pour but de permettre à tout développeur de tester la consommation énergétique d'une application en cours de développement.
Pour ce faire, nous avons mis au point un système permettant via cette interface web de déposer des APK et des fichiers nécessaires supplémentaires selon la méthode de test ([Robotium](http://robotium.com/) ou [Monkey](https://developer.android.com/studio/test/monkey.html)).

![Fonctionnalites](https://raw.githubusercontent.com/Soulk/PowerDroid/master/img/fonctionnalites.png)


## Technologies

PowerDroid a été développé en utilisant différentes technologies qui ont été utilisées sur ces dépôts :

* [Power Droid - Script launcher](https://github.com/Soulk/PowerDroid-ScriptLauncher) - Serveur java permettant d'éxécuter les scripts mis en base de données
* [PowerDroid-ScriptAnalyser](https://github.com/decottis/PowerDroid-ScriptAnalyser) - Script python permettant l'utilisation et la récupération des données via le Power Monitor

## Installation

L'application nécessite l'installation de [Node](https://nodejs.org/en/) et d'une base de donnée [Postgresql](https://www.postgresql.org/) existante.

Récupération des sources du serveur.

```sh
$ git clone https://github.com/Soulk/PowerDroid.git
```

Installe les dépendances et start le serveur.

```sh
$ cd [votre repo]
$ npm install
$ npm start
```

La database doit être configurée dans le fichier App.js comme suit :
![Fonctionnalités](https://raw.githubusercontent.com/Soulk/PowerDroid/master/img/connexionDB.png)


## Manuel d'utilisation

### Login

Après le lancement de la solution vous êtes redirigés sur la page de connection. Connectez-vous avec votre login.
Pour créer un test renez-vous sur 'Fichier de test' > 'Ajout de fichier de test'


### Création d'un test : 
Tout d'abord renseignez l'apk de votre application, ensiute renseignez le type de test que vous souhaitez lancer. Il en existe deux.

#### Robotium :

Ce type de test permet d'éxécuter le test que vous avez créé au préalable.

Pour créer le test sur android studio:

Configurations :
Java SDK (minimum 1.6)
Télécharger android studio
mettre à jour Android SDK Tools, Android Platform-tools , Android SDK Build-tools
installer robotium sur android studio

Pour créer le test lancez tools > Robotium recorder sur android studio.
Document à fournir : apk de test, AndroidManifest de test, AndroidManifest.

#### Monkey :

Ce type de test permet d'éxécuter un test totalement aléatoire et chaotique, pour tester les comportement "bizarres" de l'utilisateur.
Fichers à fournir : AndroidManifest.

Cliquez ensuite sur 'submit'

# Lancement du test

Rendez-vous sur 'Fichier de test' > 'visualiser les fichiers de test' et cliquer sur le bouton de lancement souhaité. Le test est lancé et vous êtes redirigé vers la page d'accueil où tout vos test sont répertoriés.

# Résultats du test

Quand le statut du test passe de 'En attente' à 'Terminé' le test à été complétement à 100%. Pour voir les résultats cliquer sur le test.


