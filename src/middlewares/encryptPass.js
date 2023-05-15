import{hashSync} from 'bcryptjs'
const encryptPass =(req, res, next)=>{
    const hash = hashSync('bacon', 8);
    res.local.hash = hash;
    next()
}

export {encryptPass}