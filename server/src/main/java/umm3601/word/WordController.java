package umm3601.word;

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
// import com.mongodb.client.result.InsertManyResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
// import kotlin.collections.builders.ListBuilder;
import umm3601.Controller;

@SuppressWarnings("unchecked")

public class WordController implements Controller {

    private static final String API_WORDS = "/api/anagram";
    private static final String API_WORD_BY_ID = "/api/anagram/{id}";
    static final String WORD_KEY = "word";
    static final String WORD_GROUP_KEY = "wordGroup";
    static final String SORT_ORDER_KEY = "sortOrder";

    private final JacksonMongoCollection<Word> wordCollection;

    public WordController(MongoDatabase database) {
        wordCollection = JacksonMongoCollection.builder().build(
            database,
            "words",
            Word.class,
            UuidRepresentation.STANDARD);
    }

    public void getWord(Context ctx) {
        String id = ctx.pathParam("id");
        Word word;

        try {
            word = wordCollection.find(eq("_id", new ObjectId(id))).first();
        } catch (IllegalArgumentException e) {
            throw new BadRequestResponse("The requested word id wasn't a legal Mongo Object ID");
        }
        if (word == null) {
            throw new NotFoundResponse("The requested word was not found");
        } else {
            ctx.json(word);
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
          Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_KEY)), Pattern.CASE_INSENSITIVE);
          filters.add(regex(WORD_KEY, pattern));
        }

        if (ctx.queryParamMap().containsKey(WORD_GROUP_KEY)) {
          Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_GROUP_KEY)), Pattern.CASE_INSENSITIVE);
          filters.add(regex(WORD_GROUP_KEY, pattern));
        }

        Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

        return combinedFilter;
    }

private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "word");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortOrder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
}


  public void addNewWord(Context ctx) {

    String body = ctx.body();
    Word newWord = ctx.bodyValidator(Word.class)
    .check(td -> td.word != null && td.word.length() > 0,
        "New words must be non-empty; New words was " + body)
    .check(td -> td.wordGroup != null && td.wordGroup.length() > 0,
        "Word Group must be non-empty; Group was " + body)
    // .check(td -> td.body != null && td.body.length() > 0,
    //     "Todo must have a non-empty body; body was " + body)
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
            + "; perhaps illegal ID or an ID for item not in the system?");
        }
        ctx.status(HttpStatus.OK);
  }

  //   public void addListWords(Context ctx) {
  //       List<Word> newWords = ctx.bodyValidator(List.class)
  //           .check(list -> list != null && !list.isEmpty(), "Word list cannot be empty")
  //           .check(list -> {
  //               for (Object obj : list) {
  //                   if  (!(obj instanceof Map)) {
  //                       return false;
  //                   }
  //                   Map<String, String> wordMap = (Map<String, String>) obj;
  //                   if (!wordMap.containsKey("word") || wordMap.get("word").isBlank()) {
  //                       return false;
  //                   }
  //                   if (!wordMap.containsKey("wordGroup") || wordMap.get("wordGroup").isBlank()) {
  //                       return false;
  //                   }
  //               }
  //               return true;
  //           }, "Each word in the list must have a non-empty 'word' and 'wordGroup' field")
  //           .get();
  //       if (newWords.size() == 1) {
  //             addNewWord(ctx);
  //           } else {
  //       List<Word> wordList = new ArrayList<>();
  //       for (Object obj : newWords) {
  //           Map<String, String> wordMap = (Map<String, String>) obj;
  //           Word word = new Word();
  //           word.word = wordMap.get("word");
  //           word.wordGroup = wordMap.get("wordGroup");
  //           wordList.add(word);
  //       }
  //       InsertManyResult insertManyResult = wordCollection.insertMany(wordList);
  //       List<String> insertedIds = new ArrayList<>();
  //       insertManyResult.getInsertedIds().forEach((key, value) ->
  //           insertedIds.add(value.asObjectId().getValue().toString())
  //       );
  //       ctx.json(Map.of("insertedIds", insertedIds));
  //       ctx.status(HttpStatus.CREATED);
  //   }
  // }

    // public void static deleteListWords(Context ctx) {
    //     String deleteWordGroup = ctx.pathParam("wordGroup");
    //     DeleteResult deleteResult = wordCollection.deleteMany(eq("wordGroup", null));

    //     if(deleteResult.getDeletedCount() != wordCollection.countDocuments("wordGroup", deleteWordGroup)) {
    //     ctx.status(HttpStatus.NOT_FOUND);
    //     throw new NotFoundResponse(
    //       "Was unable to delete word group "
    //         + deleteWordGroup
    //         + "; perhaps illegal word group or an word group for item not in the system?");
    //     }
    //     ctx.status(HttpStatus.OK);
    // }



  public void addRoutes(Javalin server) {
    // server.get(API_WORD_BY_ID, this::getWord);

    server.get(API_WORDS, this::getWords);

    server.delete(API_WORD_BY_ID, this::deleteWord); //used to be API_WORD_BY_ID

    server.post(API_WORDS, this::addNewWord);

    // server.post(API_WORDS, this::addListWords);

    // server.delete(API_WORDS_BY_WORDGROUP, this::deleteListWords);
  }
}




