# Architest [![Build Status](https://travis-ci.org/andresmijares/architest.svg?branch=master)](https://travis-ci.org/andresmijares/architest)
A trivial sample to display architectural practices. The production version can be found [here](http://sleepy-tiger.surge.sh/)

The scenario is as mentioned intentionally vague to follow any kind of directions, one of the most important thing to 
consider is the fact that we can only take **5 hours** at most to do this, this means, we need to define very explicit what 
we want to show and what we don't.

## Stories and Features.
* See a list of existing users.
* See a list of existing groups.
* Create users.
* Assign users to groups they aren't already part of.
* Remove users from a group.
* Delete groups when they no longer have members.
* Delete users.

## What is interest and what is not.
So yes, it's only 5 hours so the focus was really simple in the following order:
* Show architecture practices that can scale.
* Show how strong conventions and standards structures can make the software scalable with ease.  
* Show how we can decouple the UI from the bussiness logic and the state manager as well.
* Show how a functional approach can improve to add and remove functionality with ease.
* Tests that matters and generate value (and not for the sake of testing).

### What was left behind.
Even when I consider this valuable, these days UI management is couple to the domain of certain libraries/frameworks
like React, Angular, Cycle, Vue among others, therefore, I put more value on architectural practices and the domain of the
core concepts of the language.

Said this, stuff like UI validation are extremely vague, however, the pattern used allow to extend them to other validations very easily.

Last, they UI is.... ugly ¯\_(ツ)_/¯

End points and persistence were not considered, everything happens in the local state, however, it's a no brainer to connected it
an external source in the API layer `data` and it should work the same without any extra work.

## Installation and Stack used.
Make sure you have `yarn` installed, on your console after clone the repo.
```javascript
npm install yarn -g
yarn install
yarn run start 
```
For testing in dev mode use `yarn run test:dev`

I used `React` for the UI, `Redux` for the state management and `redux-saga` for the orchestration between both (the service layer).

## Architectural rules.
Very simple... literally very...
* UI is not couple with business logic.
* State do not store UI actions.
* Services are triggered via dispatched actions.
* Each service is defined as an independent module.
* Orchestration for each and between services happens via a saga (function generator).
* Each code service operation is a pure function.
* State is modified using the rule `Input` -> `Saga` -> `State` -> `Process` -> `Ouput` (this way we dont stress the reducers layer).
* Tests are integration style (I don't test implementations details).

## The process
At first, we define and test each service and decide which data structure is the best that can be shared to saved us some time
and also being able to create an standard.

Each service holds at least 4 actions using the following pattern `{action}_{service}_{status}`:
	* **create_users** Activates the operation.
	* **create_users_start**
	* **create_users_success** Sends information to the reducers
	* **create_users_error**
	
Mostly we only send normalized information to the reducers, this way to can achieve to [share the same operation](https://github.com/andresmijares/architest/blob/master/app/services/users/reducers.js#L9) for different actions
which your future self will thanks, it's easier to maintain.

In this case, errors are common, not needed to create custom operations, therefore, all can be managed via [middleware](https://github.com/andresmijares/architest/blob/master/app/services/errors/errorMiddleware.js). 

Each core operation are divided by small chunks and [pipe them together](https://github.com/andresmijares/architest/blob/master/app/services/users/helpers.js#L67), this functional
pattern allow us to add and remove different validations with ease, for sample:
	* We have a validation when creating an user to have at least 1 group assigned, we normally set this as an UI validation, 
	but we can add another layer of security testing at `service layer`.
	* Also sometimes is useful to validate against the state, when can easily curried the state which allows to test in
	without coupling to the redux store different operations and scenarios.
	
The pattern used for `groups` and `users` is the same, both can share the same structure therefore, there is not much to talk here,
the code is very descriptive. `Listin` -> `Operation` -> `Store Updated`.

Since the structure is the same, I only tests for `users`, the same pattern can be used to tests the `groups` as well.

In terms of UI, I agree I was really lazy, I needed to keep it at 5 hours time, therefore, I went with something really simple.

There is nothing fancy to see in the UI layer, only React component that listen for changes in the state.

## If I had more time...
This is obviously and mvp, given more time I would go with:
* Make UI test (Snapshots).
* Make a router and have a different page for each.
* Create more tests cases scenarios.
* Make something more complex with user validations (not only a name lol). 🤣

## More
For more information about the decision and the style made, you can refer to the following posts that I've writen:
* [Front end Agile Enterprise Architectures](https://medium.com/shiftgig-blog/agile-front-end-architectures-with-react-redux-and-vanilla-js-23f4e5626e01)
* [Redux Saga common patterns](https://medium.com/shiftgig-blog/redux-saga-common-patterns-48437892e11c)	
* [Async Operations with Redux Saga](https://medium.freecodecamp.org/async-operations-using-redux-saga-2ba02ae077b3)


## License
MIT
