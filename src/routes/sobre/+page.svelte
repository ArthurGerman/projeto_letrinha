<body>
    <div id="container">
        <div id="sobre">
            <h1>Sobre o jogo</h1>
            <p>Este atividade refere-se ao projeto de jogo realizado no final do semestre, feito à pedido do professor Allan Lima. No nosso caso, o jogo que nós escolhemos como base foi o Termo. Este projeto foi desenvolvido pelos alunos: </p>

            <ul>
                <li>Arthur Germano;</li>
                <li>Elder da Silva;</li>
                <li>Guilherme Evaristo;</li>
                <li>Lucas Bezerra;</li>
                <li>Renato Aprígio;</li>
                <li>Thiago Henrique.</li>
            </ul>
        </div>

        <div id="table">
            <table border="2">
                <tbody>
                    <tr>
                        <td>
                            <p>Membro 1</p>
                        </td>
                        <td>
                            <p>Membro 2</p>
                        </td>
                        <td>
                            <p>Membro 3</p>
                        </td>
                        <td>
                            <p>Membro 4</p>
                        </td>
                        <td>
                            <p>Membro 5</p>
                        </td>
                        <td>
                            <p>Membro 6</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="voltar">
            <a href="/">Voltar</a>
        </div>
    </div>
</body>

<style>
    body{
        margin: 0;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    #container{
        height: 100vh;
        width: 100%;
    }
    #table{
        display: flex;
        justify-content: center;
    }


    #sobre{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    #sobre p{
        width: 40%;
        text-align: center;
    }


    #voltar{
        justify-content: center;
        display: flex;
    }
    #voltar a{
        margin-top: 30px;
    }


    table{
        margin-top: 30px;
    }
    td{
        padding: 10px;
        width: 150px;
        height: 200px;
    }

</style>