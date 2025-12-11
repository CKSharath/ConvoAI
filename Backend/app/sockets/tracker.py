from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

router = APIRouter(prefix="/ws")

# Each client:
# {
#   "ws": WebSocket,
#   "role": str,
#   "mission_id": int | None
# }
clients = []


@router.websocket("/track")
async def track_socket(websocket: WebSocket):
    """
    Client must send an init message after connect:
    {
        "role": "DRIVER",
        "mission_id": 3
    }
    """
    await websocket.accept()

    try:
        init_msg = await websocket.receive_text()
        init_data = json.loads(init_msg)

        role = init_data.get("role")
        mission_id = init_data.get("mission_id")

        client = {
            "ws": websocket,
            "role": role,
            "mission_id": mission_id
        }
        clients.append(client)

        # Keep connection alive
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        clients[:] = [c for c in clients if c["ws"] != websocket]


# -------------------------
# Broadcast helpers
# -------------------------
async def broadcast_position(data):
    """
    data must include mission_id
    """
    msg = json.dumps({"type": "position", "data": data})

    for client in clients:
        # DRIVER → only own convoy
        if client["role"] == "DRIVER":
            if client["mission_id"] != data.get("mission_id"):
                continue

        await client["ws"].send_text(msg)


async def broadcast_route(data):
    """
    data must include mission_id
    """
    msg = json.dumps({"type": "route_update", "data": data})

    for client in clients:
        # DRIVER → only own convoy
        if client["role"] == "DRIVER":
            if client["mission_id"] != data.get("mission_id"):
                continue

        await client["ws"].send_text(msg)
