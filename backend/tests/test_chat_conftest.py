import pytest
from sqlmodel import create_engine, Session
from src.models.conversation import Conversation, Message


@pytest.fixture(name="engine")
def fixture_engine():
    engine = create_engine("sqlite:///:memory:", echo=True)
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture(name="session")
def fixture_session(engine):
    with Session(engine) as session:
        yield session