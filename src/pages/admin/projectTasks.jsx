import React from 'react'
import Layout from '../../layout'
import Container from '../../common/container'
import Heading from '../../common/heading'

function projectTasks() {
  return (
    <>
    <Layout activePageName={"Tasks"}>
      <Container>
      <div className="mt-10"> 
        <Heading title={"Project Tasks"}></Heading>
  
     {/* if u want u can add overflow-x-auto to add horizontal scroll for small screens */}
        <div className="my-4 ">
  
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-white text-gray-800 text-sm font-thin">
                <th className="py-6 px-4 ">No.</th>
                <th className="py-6 px-4 ">Property Number</th>
                <th className="py-6 px-4 ">Payment Number</th>
                <th className="py-6 px-4 ">Classification</th>
                <th className="py-6 px-4 ">Classification Explained</th>
                <th className="py-6 px-4 ">Property Old Area</th>
                <th className="py-6 px-4 ">Owner Type</th>
                <th className="py-6 px-4 ">Owner Id</th>
                <th className="py-6 px-4 ">Property Address</th>
                <th className="py-6 px-4 ">Owner Name</th>
                <th className="py-6 px-4 ">Notes</th>
              </tr>
            </thead>
            <tbody className="rounded-full text-center text-sm font-thin">
              
              <tr className="bg-gray-200">
                <td className="py-4 px-4 rounded-l-full">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">XXX</td>
                <td className="py-4 px-4">Muskan</td>
                <td className="py-4 px-4 rounded-r-full">XXX</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </Container>
    </Layout>
  </>
  
  
  
  )
}

export default projectTasks
