import React from "react"
import Status from '../router/statusRoute'
function NotFound() {
    return (
        <Status code={404}>
            <div>
                <h1>Sorry, can’t find that.</h1>
            </div>
        </Status>
    );
}
export default NotFound