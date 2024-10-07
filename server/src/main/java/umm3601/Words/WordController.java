package umm3601.Words;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class WordController implements Controller {

  private static final String API_WORD = "/api/word";
  private static final String API_WORD_BY_ID = "/api/word/{id}";
  private static final String WORD_KEY = "word";
  private static final String WORDGROUP_KEY = "wordgroup";

  private final JacksonMongoCollection<Word> wordCollection;

  public WordController(MongoDatabase database) {
    wordCollection = JacksonMongoCollection.builder().build(
        database,
        "users",
        Word.class,
        UuidRepresentation.STANDARD);
  }

  public void getWord(Context ctx) {
    String id = ctx.pathParam("id");
    Word words;

    try {
      words = wordCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested user id wasn't a legal Mongo Object ID.");
    }
    if (words == null) {
      throw new NotFoundResponse("The requested user was not found");
    } else {
      ctx.json(words);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getWords(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);

    Bson sortingOrder = constructSortingOrder(ctx);

    ArrayList<Word> matchingWords = wordCollection
        .find(combinedFilter)
        .sort(sortingOrder)
        .into(new ArrayList<>());

    ctx.json(matchingWords);
    ctx.status(HttpStatus.OK);
}


private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>();

    if (ctx.queryParamMap().containsKey(WORD_KEY)) {
        Pattern wordPattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_KEY)), Pattern.CASE_INSENSITIVE);
        filters.add(regex(WORD_KEY, wordPattern));
    }

    if (ctx.queryParamMap().containsKey(WORDGROUP_KEY)) {
        Pattern wordGroupPattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_GROUP_KEY)), Pattern.CASE_INSENSITIVE);
        filters.add(regex(WORDGROUP_KEY, wordGroupPattern));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
}



  private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "word");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public void addNewWord(Context ctx) {
    String body = ctx.body();
    Word newWord = ctx.bodyValidator(Word.class)
        .check(wrd -> wrd.word != null && wrd.word.length() > 0,
            "Word must be non-empty; body was " + body)
        .check(wrd -> wrd.wordGroup != null && wrd.wordGroup.length() > 0,
            "Word Group must be non-empty; body was " + body)
        .get();

    wordCollection.insertOne(newWord);
    ctx.json(Map.of("id", newWord._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void deleteWord(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = wordCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }

  public void addRoutes(Javalin server) {
    // Get the specified word
    server.get(API_WORD_BY_ID, this::getWord);

    // List words, filtered using query parameters
    // server.get(API_WORD, this::getWords);

    // Delete the specified word
    server.delete(API_WORD_BY_ID, this::deleteWord);

    // Add new word with the word info being in the JSON body
    // of the HTTP request
    server.post(API_WORD, this::addNewWord);
  }
}
