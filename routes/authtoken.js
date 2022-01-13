const jwt=require('jsonwebtoken');
function getTokenFromHeaders(req){
    const token =
        req.body.token || req.query.token || req.headers['authorization']

    if (!token) return token

    
    return token
}


module.exports={
   validateToken:(req, res, next)=>{
       const token = getTokenFromHeaders(req)
   
   
       if (token) {
           jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
               if (err) {
                   return res.json({
                       success: false,
                       message: 'Failed to authenticate token.',
                   })
               } else {
                   req.decoded = decoded
                   req.token=token
                   next()
               }
           })
       } else {
           return res.status(500).send({
               success: false,
               message: 'No token provided.',
           })
       }
   }
   
   // function authenticate(req,res,next){
   //     const authheader=req.headers['authorization']
   //     const token=authheader && authheader.split(' ')[1]
   //     console.log(token)
   //     if(token==null) res.sendStatus(402)
   //     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
   //         if(err) res.sendStatus(403) 
   //         req.user=user
   //         next()
   //     })
   // }
   }