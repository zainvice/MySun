import React from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Heading from "../../common/heading";
import Button from "../../common/button";
import WorkersTable from "../../components/workersTable";
function Workers() {
  return (
    <Layout>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={"Workers"} />
          <Button title={"Add New Workers"} />
        </div>
        <WorkersTable />
      </Container>
    </Layout>
  );
}

export default Workers;
