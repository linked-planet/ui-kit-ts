import React from "react";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button";

function NotFoundPage() {

    return (
        <EmptyState
            header="404 - Not found"
            description={<span>The page you were looking for doesn't exist...</span>}
            primaryAction={
            <Button
                onClick={() => window.location.href="/"}
                appearance="primary"
            >Back to start</Button>
                }
        />
    )
}

export default NotFoundPage;