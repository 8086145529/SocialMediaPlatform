import jwt from 'jsonwebtoken'

export const verifyToken = async(req,res,next)=>{
    try {
        let token = req.header("Authorization")//This line extracts the value of the "Authorization" header from the incoming HTTP request. This header is often used to send tokens for authentication.

        if(!token){
            return res.status(403).send("Access Denied")//If there is no token in the "Authorization" header, the middleware responds with a 403 status code (Forbidden) and a message indicating access is denied.
        }

        if(token.startsWith("Bearer ")){//This checks if the token starts with the string "Bearer ".
            token = token.slice(7,token.length).trimLeft()//array.slice(starting index no.,ending index no) this gives a new array containing the element with the starting index number and excluding the element with ending index number.so here 7 means the index number after Bearer i.e the space and the token.length means an index no. which is +1 greater than the last character's index number.so as the ending index numbered element is excluded.we get the real token after the bearer and .trimLeft() trims the space before the real token.
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET)//The jwt.verify method is used to verify the token's authenticity using a secret key (process.env.JWT_SECRET). This key should match the one used to sign the token during its creation.
        req.user = verified//If the verification is successful, the decoded user information (extracted from the token) is attached to the request object as req.user. This information can be used in subsequent middleware functions or route handlers.
        next()// If everything is successful, this line calls the next() function, allowing the request to continue to the next middleware or route handler in the application.i.e the next one defined in the routes
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}