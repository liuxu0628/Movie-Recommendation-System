import React from 'react';
import styled from 'styled-components';

export const Button = styled.button`
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 5px;
    border: 0;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.2px;
    width: 60%;
    padding: 15px 20px;
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    margin: 0 auto!important;
    text-transform: uppercase;
    transition: background-color 0.7s;

    &:before {
        opacity: 0;
        background: #ff00ab;
        border-radius: 5px;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        transform: scale3d(0.7, 1, 1);
        transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
        transition: transform 0.4s, opacity 0.4s;
        width: 100%;
        z-index: -1;
    }

    &:hover {
        background-color: #ff00ab;

        &:before {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
`;

export const Button1 = styled.button`
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 5px;
    border: 0;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.2px;
    margin: 5px 8px 5px 0;
    min-width: 135px;
    padding: 15px 25px;
    position: relative;

    text-transform: uppercase;
    transition: background-color 0.7s;

    &:before {
        opacity: 0;
        background: #ff00ab;
        border-radius: 5px;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        transform: scale3d(0.7, 1, 1);
        transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
        transition: transform 0.4s, opacity 0.4s;
        width: 100%;
        z-index: -1;
    }

    &:hover {
        background-color: #ff00ab;

        &:before {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
`;

const Primary = styled(Button)`
    background-color: #495285;
`;

export const GenreButton = props => {
    return <Button>{props.title}</Button>;
};

export const GenreButton1 = props => {
    return <Button1>{props.title}</Button1>;
};

export const GenericButton = props => {
    return (
        <Button onClick={props.onClick}>
            {props.icon} {props.title}
        </Button>
    );
};

export const PrimaryButton = props => {
    return (
        <Primary>
            {props.icon} {props.title}
        </Primary>
    );
};
