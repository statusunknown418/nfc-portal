# NFC Portal

NFC @ Stackk Studios

## Edge cases

1. Need a way to ensure the JWT on sign-in is valid and ALWAYS contains the user's **USERNAME** (specially on **INITIAL** sign in)
2. /admin page - if done really quickly this may occur
   - 1. try drag and drop the links to reorder
   - 2. edit anything on the link you just reordered BEFORE the portal is updated
   - 3. sometimes that link will get shuffled around, not preserving the new ordered position
