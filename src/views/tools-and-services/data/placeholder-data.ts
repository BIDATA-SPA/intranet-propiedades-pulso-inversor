export type ItemProps = {
    id: number | string
    title: string
    description: string
    image: {
        src: string
    }
}

const itemsList: ItemProps[] = [
    {
        id: 1,
        title: 'Documentos Técnicos Legales',
        description:
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
        image: {
            src: 'https://res.cloudinary.com/dbrhjc4o5/image/upload/v1709049741/Dise%C3%B1o_sin_t%C3%ADtulo_yhmgki.png',
        },
    },
    {
        id: 2,
        title: 'Cursos y Capacitación',
        description:
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
        image: {
            src: 'https://res.cloudinary.com/dbrhjc4o5/image/upload/v1709049741/Dise%C3%B1o_sin_t%C3%ADtulo_1_whwblr.png',
        },
    },
    {
        id: 3,
        title: 'Evaluaciones Crediticias',
        description:
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
        image: {
            src: 'https://res.cloudinary.com/dbrhjc4o5/image/upload/v1709049741/Dise%C3%B1o_sin_t%C3%ADtulo_2_ea3vd8.png',
        },
    },
]

export type FolderList = {
    id: number
    name: string
}

export type FileList = {
    id: number
    name: string
}

// Folders List
const folderList: FolderList[] = [
    { id: 10, name: 'Principios Legales' },
    { id: 11, name: 'Proceso de Corretaje' },
    { id: 12, name: 'Documentacion Tecnica formal' },
    { id: 13, name: 'Respaldo Documentacion' },
    { id: 14, name: 'Documentacion externa' },
    { id: 15, name: 'Otros' },
]

// Files List
const fileList: FileList[] = [
    { id: 16, name: 'Archivo 1' },
    { id: 17, name: 'Archivo 2' },
]

export { fileList, folderList, itemsList }
