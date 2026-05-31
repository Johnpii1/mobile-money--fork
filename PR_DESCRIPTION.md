## Description

Implemented strict GraphQL query complexity limiting using the `graphql-query-complexity` plugin. Set maximum complexity to 500 points per request to protect the Apollo server from maliciously complex queries.

## Related Issue

Implements issue #? (Replace with actual issue number)

## Type of Change

- [x] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Changes Made

- Added `createComplexityRule` with `maximumComplexity: 500` to ApolloServer validation rules in `src/graphql/server.ts`.
- Updated comment formatting for clarity.

## Testing

- Added/updated unit tests in `src/tests/graphql-depth-complexity.test.ts` to verify that queries exceeding the complexity limit are rejected and valid queries pass.

## Checklist

- [x] Code follows project style
- [x] Self-reviewed my code
- [x] Commented complex code
- [x] Updated documentation
- [x] No new warnings
- [x] Added tests (if applicable)
