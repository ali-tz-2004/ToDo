# Todo App
![todo app](/todo.PNG)

## Welcome! 👋
This is a simple Todo app build.

## Getting Started
To get started with the app, clone the repo and then install the necessary dependencies:

## Run app
```open project
git clone https://github.com/ali-tz-2004/ToDo.git
```

## todo-service
open todo-service with this code:
```open todo-service
cd todo-service/Todo.API
```
go to appsettings.json and set DefaultConnection with you data connection(sql server)
after write this code in terminal:
```
dotnet ef database update
```

## todo-client
open todo-client with this code:
```open todo-client
cd todo-client
```
install npm:
```npm
npm install
```
or
install yarn:
```
yarn
```

Usage
Once you have installed the dependencies, you can start the app with:

npm:
```
 npm start
```
yarn:
```
yarn start
```
The app will be served at http://localhost:3000.


Features
With this app, you can:

Create new Todo items
Edit existing Todo items
Mark Todo items as completed
Delete Todo items
Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a suggestion for improvement.
Thank you ❤

Acknowledgments
This app was built with the help of react, typescript, material ui, .NET