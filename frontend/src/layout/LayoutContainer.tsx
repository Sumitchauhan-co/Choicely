import React from "react";

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="relative min-h-screen max-w-full dark:bg-black dark:text-(--primary-color)">
            {children}
        </div>
    );
};

export default Container;
