'use strict';


/**
 * Autentica um serviço
 * Retorna um token válido para as futuras requisições
 *
 * xAPIKEY UUID Key
 * returns String
 **/
exports.authPOST = function(xAPIKEY) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['text/plain'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.J9cMG3ojMDGuMtroNI1Xe_rMS5XuQ346hzV-4Wy2-ko";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

