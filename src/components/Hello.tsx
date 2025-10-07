import { type FC } from 'react';

type HelloProps = {
	message: string;
};

const Hello: FC<HelloProps> = ({ message }) => {
	return <h1>{message}</h1>;
};

export default Hello;
