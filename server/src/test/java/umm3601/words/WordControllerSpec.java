package umm3601.words;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatcher;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.Validation;
import io.javalin.validation.ValidationError;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;
import umm3601.Words.Word;
import umm3601.Words.WordController;

@SuppressWarnings({ "MagicNUmber" })
class WordControllerSpec {

  private WordController wordsController;

  private ObjectId johnporkId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;

  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Word>> wordsArrayListCaptor;

  @Captor
  private ArgumentCaptor<Word> wordsCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    // Reset our mock context and argument captor (declared with Mockito annotations
    // @Mock and @Captor)
    MockitoAnnotations.openMocks(this);

    // Setup database
    MongoCollection<Document> wordsDocuments = db.getCollection("users");
    wordsDocuments.drop();
    List<Document> testWords = new ArrayList<>();
    testWords.add(
        new Document()
            .append("word", "sigma")
            .append("wordgroup", "brainrot"));
    testWords.add(
        new Document()
            .append("word", "freakbob")
            .append("wordgroup", "brainrot"));
    testWords.add(
        new Document()
            .append("word", "xbox")
            .append("wordgroup", "video games"));
    testWords.add(
        new Document()
            .append("word", "playstation")
            .append("wordgroup", "video games"));
    testWords.add(
        new Document()
            .append("word", "skibiddy")
            .append("wordgroup", "brainrot"));

    johnporkId = new ObjectId();
    Document johnpork = new Document()
        .append("_id", johnporkId)
        .append("name", "johnpork")
        .append("age", 45)
        .append("company", "OHMNET")
        .append("email", "sam@frogs.com")
        .append("role", "viewer")
        .append("avatar", "https://gravatar.com/avatar/08b7610b558a4cbbd20ae99072801f4d?d=identicon");

    wordsDocuments.insertMany(testWords);
    wordsDocuments.insertOne(johnpork);

    wordsController = new WordController(db);
  }

  @Test
  public void canBuildController() throws IOException {
    Javalin mockServer = Mockito.mock(Javalin.class);
    wordsController.addRoutes(mockServer);

    verify(mockServer, Mockito.atLeast(2)).get(any(), any());
  }

  @Test
  void addsRoutes() {
    Javalin mockServer = mock(Javalin.class);
    wordsController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(2)).get(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }


  @Test
  void canGetAllWords() throws IOException {
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());
    wordsController.getWords(ctx);

    verify(ctx).json(wordsArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(
        db.getCollection("words").countDocuments(),
        wordsArrayListCaptor.getValue().size());
  }


}
