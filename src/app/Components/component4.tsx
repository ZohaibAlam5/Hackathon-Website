export default function Heading(props: {name: string}){
    return(
        <div className="bg-gray-50">
        <section className="bg-purple-100 text-center py-10">
          <h1 className="text-3xl font-bold text-gray-800">{props.name}</h1>
        </section>
      </div>
    )
}