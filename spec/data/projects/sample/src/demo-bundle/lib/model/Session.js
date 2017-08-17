/**
 * @Bass:Document(collection="sessions")
 */
module.exports = class Session {

    /**
     *
     * @constructor
     */
    constructor() {

        /**
         * @Bass:Id
         * @Bass:Field(type="ObjectID", name="_id")
         */
        this.id = null;

        /**
         * @Bass:Field(type="Object", name="data")
         */
        this.data = {};

        /**
         * @Bass:Version
         * @Bass:Field(type="Number", name="version")
         */
        this.version = 0;

        /**
         * @Bass:Field(type="Date", name="expires_at")
         */
        this.expiresAt = null;

        /**
         * @Bass:CreatedAt
         * @Bass:Field(type="Date", name="created_at")
         */
        this.createdAt = null;

        /**
         * @Bass:UpdatedAt
         * @Bass:Field(type="Date", name="updated_at")
         */
        this.updatedAt = null;

    }

};