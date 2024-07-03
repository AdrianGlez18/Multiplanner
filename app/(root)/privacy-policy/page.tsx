import React from 'react'

const PrivacyPolicy = () => {
    return (
        <div className="flex flex-col w-full items-center justify-center">
            <div className=" min-h-screen  items-center justify-between p-24 w-full max-w-4xl scroll-auto mx-2">
                <h1 className='my-2 lg:my-4 xl:my-8 p-4 text-lg xl:text-3xl'>Privacy Policy</h1>
                <p className='my-2 text-justify'>
                    Esta web es un proyecto universitario realizado únicamente con fines formativos como trabajo de fin de grado para la Universidad de La Laguna. La información almacenada no se utilizará para ningún otro fin distinto al correcto funcionamiento de la aplicación. Ningún dato se compartirá con terceros bajo ninguna circunstancia.
                </p>
                <p className='my-2 text-justify'>
                    Multiplanner utiliza una base de datos Mongo para almacenar la siguiente información:
                </p>
                <ol className='list-decimal list-inside'>
                    <li className='my-3 text-justify'>Perfil de usuario, donde se incluye su nombre, email, fecha de registro, foto de perfil y accesos a Zoom y Google si el usuario los ha autorizado previamente.</li>
                    <li className='my-3 text-justify'>Historial de reuniones pasadas y futuras que el usuario haya planificado desde la Multiplanner. Ninguna otra reuión será almacenada, y el usuario puede eliminarlas cuando considere desde la propia aplicación.</li>
                    <li className='my-3 text-justify'>Grupos de usuarios que se hayan creado desde la propia aplicación. Estos grupos se utilizan para planificar reuniones rápidamente. El usuario también puede eliminarlos en cualquier momento.</li>
                    <li className='my-3 text-justify'>Grabaciones de aquellas reuniones planificadas con Multiplanner que el usuario haya realizado manualmente.</li>
                </ol>

                <p className='my-2 text-justify'>Para cualquier detalle adicional, consultar con admin@aglez.dev. Mediante un email a este correo se puede solicitar la eliminación parcial o total de cualquier dato almacenado del usuario, y se realizará en como máximo 5 días hábiles.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicy