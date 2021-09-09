const { User } = require('../../models/User');
const { Token } = require('../../models/Token');
const { sendEmail } = require('../../helpers/helper');

class ForgotPasswordController {
    async index(req, res){
        try{
            if(!req.body.email) return res.status(400).json({message: 'Bad request.'});

            const user = await User.findOne({email: req.body.email});
            if(!user) return res.status(404).json({message: 'User not found.'});

            await Token.findOneAndRemove({userId: user._id});

            const token = new Token({
                type: 'reset-password',
                userId: user._id
            });
            await token.save();

            let html = `Olá ${user.name},
                        <br><br>
                        Recebemos uma solicitação para redefinir sua senha.
                        <br>
                        Para continuar, entre no sistema e digite o código abaixo:
                        <br>
                        <b>Código: ${token.value}</b>
                        <br><br>
                        Caso não tenha solicitado a redifinição de sua senha, ignore esse email.`;
            const email = await sendEmail(user.email, 'Esqueceu sua senha?', '', html);

            return res.status(200).json({message: 'Email sended.', userId: user._id});
        } catch(ex){
            console.log(ex);
            return res.status(500).json({message: 'Internal error.'});
        }
    }
}

module.exports = new ForgotPasswordController();