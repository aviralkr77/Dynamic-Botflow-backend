import {jwt} from 'jsonwebtoken';
import config from './config/dbconfig.js';
const dbConfig = config.get(process.env.NODE_ENV);


const authorization = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, dbConfig.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded;
        next();
    });
}

export default authorization;