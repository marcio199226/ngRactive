# Wrapper for ractive.js components & decorators

It works with lazy mode enabled and with both isolated or not islated scope.

This module provide differents "environments"

You may wrap a static component and dynamic component that renders according to props passed in.
Furthermore it allows us to observe on provided props by angular and updating related props in ractive component to rerender it again
If you want you might watch for changes on ractive component's props too setting two-way-props attribute on ng-ractive-component directive but this mode works only if twoway is enabled on ractive component or if you update props manually.

Run:
npm install && bower install
webpack --progress 
and open index.html