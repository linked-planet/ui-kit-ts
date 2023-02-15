import React, {useEffect} from "react";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";

function NotFoundPage() {
    const navigation = useNavigate()

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({
            type: "SET_MENU"
        })
    }, [])

    return (
        <EmptyState
            header="404 - Not found"
            description={<span>The page you were looking for doesn't exist...</span>}
            primaryAction={
            <Button
                onClick={() => navigation("/")}
                appearance="primary"
            >Back to start</Button>
                }
        />
    )
}

export default NotFoundPage;