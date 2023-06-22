import { Types, Web } from "gd-sprest-bs";

/**
 * Security
 */
export class Security {
    // Current User
    private static _currentUser: Types.SP.User = null;
    static get CurrentUser(): Types.SP.User { return this._currentUser; }

    // Is Admin
    private static _isAdmin: boolean = false;
    static get IsAdmin(): boolean { return this._isAdmin; }

    // Is Owner
    private static _isOwner: boolean = false;
    static get IsOwner(): boolean { return this._isOwner; }

    // Initialization
    static init(): PromiseLike<void> {
        // Return a promise
        return new Promise(resolve => {
            // Get the current user
            Web().CurrentUser().execute(user => {
                // Set the flag
                this._currentUser = user;
                this._isAdmin = user.IsSiteAdmin;

                // See if this is not the admin
                if (!this._isAdmin) {
                    // Get the current user
                    Web().AssociatedOwnerGroup().Users().execute(users => {
                        // Parse the users
                        for (let i = 0; i < users.results.length; i++) {
                            // See if this is the current user
                            if (users.results[i].Id == this._currentUser.Id) {
                                // Set the flag and break from the loop
                                this._isOwner = true;
                            }
                        }

                        // Resolve the request
                        resolve();
                    });
                } else {
                    // Resolve the request
                    resolve();
                }
            }, () => {
                // Resolve the request
                resolve();
            });
        });
    }
}