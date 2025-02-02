import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useOffset, updateURLParams } from "../../hooks/URLParams";
import { useSecondaryEffect } from "../../hooks/useSecondaryEffect";
import Link from "next/link";
import { useRouter } from "next/router";
import Moment from "react-moment";
import Pagination from "../pagination";
import LoadingTable from "../loadingTable";
import { Actions } from "../../utils/apiData";

export default function EventsList(props) {
  const { errorHandler, hidePagination } = props;
  const router = useRouter();
  const { execApi } = useApi(props, errorHandler);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<
    { type: string; count: number; min: number; max: number; example: any }[]
  >(props.types);
  const [total, setTotal] = useState<number>(props.total);

  // pagination
  const limit = 100;
  const { offset, setOffset } = useOffset();

  useSecondaryEffect(() => {
    load();
  }, [offset, limit]);

  async function load(event?) {
    if (event) {
      event.preventDefault();
    }

    setTotal(0);
    setLoading(true);
    const response: Actions.EventsTypes = await execApi(
      "get",
      `/events/types`,
      {
        limit,
        offset,
      }
    );
    setLoading(false);
    if (response?.types) {
      setTypes(response.types);
      setTotal(response.total);
      if (offset > response.total) {
        setOffset(0);
      }
    }

    updateURLParams(router, { offset });
  }

  return (
    <>
      {hidePagination ? null : <p>{total} unique event types</p>}

      {hidePagination ? null : (
        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onPress={setOffset}
        />
      )}

      <br />

      <LoadingTable loading={loading}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Example Data</th>
            <th>Most Recent Occurrence</th>
            <th>First Occurrence</th>
            <th>Total Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={`type-${type.type}`}>
              <td>
                <Link href={`/events/stream?type=${type.type}`}>
                  <a>
                    <strong>{type.type}</strong>
                  </a>
                </Link>
              </td>
              <td>
                <code>{JSON.stringify(type.example.data, null, 2)}</code>
              </td>
              <td>
                <Moment fromNow>{type.max}</Moment>
              </td>
              <td>
                <Moment fromNow>{type.min}</Moment>
              </td>
              <td>{type.count}</td>
            </tr>
          ))}
        </tbody>
      </LoadingTable>

      {hidePagination ? null : (
        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onPress={setOffset}
        />
      )}
    </>
  );
}

EventsList.hydrate = async (ctx, queryOverrides = {}) => {
  const { execApi } = useApi(ctx);
  const { limit, offset, type } = ctx.query;
  const { types, total } = await execApi("get", `/events/types`, {
    limit: queryOverrides["limit"] ? queryOverrides["limit"] : limit,
    offset,
    type,
  });
  return { types, total };
};
