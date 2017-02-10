# Power Droid

Interface web utilsée pour la gestion de fichiers, le lancement des scripts d'analyse de données énergétiques et la présentation des résultats de ceux-ci.

### Résumé

Ce projet à pour but de permettre à tout développeur de tester la consommation énergétique d'une application en cours de développement.
Pour ce faire, nous avons mis au point un système permettant via cette interface web de déposer des APK et des fichiers nécessaires supplémentaires selon la méthode de test ([Robotium](http://robotium.com/) ou [Monkey](https://developer.android.com/studio/test/monkey.html)).

![Fonctionnalités](https://raw.githubusercontent.com/Soulk/PowerDroid/master/img/fonctionnalites.png)


### Technologies

PowerDroid a été développé en utilisant différentes technologies qui ont été utilisées sur ces dépôts :

* [Power Droid - Script launcher](https://github.com/Soulk/PowerDroid-ScriptLauncher) - Serveur java permettant d'éxécuter les scripts mis en base de données
* [PowerDroid-ScriptAnalyser](https://github.com/decottis/PowerDroid-ScriptAnalyser) - Script python permettant l'utilisation et la récupération des données via le Power Monitor

### Installation

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


