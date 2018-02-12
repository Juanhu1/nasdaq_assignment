"# nasdaq_assignment" 

install:
    npm install

Run:

    for periodic check (10 minutes) and store the index value into a local mysql database:
        node nasdaq_checker.js

    for provide a rest service:
        node nasdaq_rest.js

        usage: localhost:3000/getindex

Run with task runner:
   
        npm run gulp