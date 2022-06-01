const textoAcompanhe = 'Acompanhe seu pedido na seção meus pedidos, vamos atualizando o status do seu pedido.'
const subjectNovaCompra = 'Confirmação de compra Ressaqueira - '
const bodyNovaCompra = 'Olá<br></br><br></br>Obrigado por ter escolhido a cerveja Ressaqueira.<br></br>'+textoAcompanhe

const subjectAlteracaoStatus = 'Seu pedido mudou de status - '
const bodyAlteracaoStatus = 'Olá<br></br><br></br>Obrigado por ter escolhido a cerveja Ressaqueira.<br></br>Seu pedido mudou de status:<br></br>Status atual: '
const TIPO_NOVA_COMPRA = 'NOVA_COMPRA'
const TIPO_ATUALIZACAO_STATUS = 'ATUALIZACAO_STATUS'


async function sendEmail(idCompra,toMailCliente,novoStatus,emailTipo){
     let subject = ''
     let body = ''
    if(emailTipo === TIPO_NOVA_COMPRA){
        subject = subjectNovaCompra + idCompra;
        body = bodyNovaCompra
    }
    if(emailTipo === TIPO_ATUALIZACAO_STATUS){
        subject = subjectAlteracaoStatus + idCompra;
        body = bodyAlteracaoStatus+novoStatus
    }

    let resp = await fetch('http://192.168.1.66:3000/sendEmail/'+subject+'/'+body+'/'+toMailCliente);
    
    
    console.log('Chamada serviço Email' , resp);
  }

  export default sendEmail()